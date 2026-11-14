import { html, type PropertyValues } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { ValueState } from '../base.js';
import { FormElement, bounded } from '../catalog-support.js';
export class RangeSlider extends FormElement {
    static formAssociated = true;
    static override properties = { value: { type: Number }, defaultValue: { type: Number, attribute: 'default-value' }, min: { type: Number }, max: { type: Number }, step: { type: Number }, valueText: { attribute: false } };
    declare value: number | undefined;
    declare defaultValue: number | undefined;
    declare min: number;
    declare max: number;
    declare step: number;
    declare valueText: ((value: number) => string) | undefined;
    private state = new ValueState<number>();
    constructor() { super(); this.min = 0; this.max = 100; this.step = 10; }
    get committedValue() { const value = this.state.read(this.value, this.defaultValue, () => this.min); bounded(value, this.min, this.max, this.step); return value; }
    resetControl() { this.state.reset(); this.requestUpdate(); }
    restoreControl(value: string | FormData | File | null) { if (typeof value === 'string') {
        this.state.set(Number(value));
        this.requestUpdate();
    } }
    override updated(_changed: PropertyValues) { const input = this.renderRoot.querySelector('input')!; input.value = String(this.committedValue); this.sync(input, String(this.committedValue), String(this.committedValue)); }
    private input = (event: Event) => { const input = event.target as HTMLInputElement; const value = Number(input.value); if (!this.formControl.disabled && value !== this.committedValue) {
        this.state.set(value);
        this.emit('value-change', { value });
    } input.value = String(this.committedValue); this.requestUpdate(); };
    override render() { this.validateName(); const state = this.formControl.disabled ? 'disabled' : ''; const value = this.committedValue; return html `<div data-krds-component="range-slider" data-krds-part="root" data-krds-state=${state} part="root"><label data-krds-component="range-slider" data-krds-part="label" data-krds-state="" part="label" for="control">${this.label}</label><input data-krds-component="range-slider" data-krds-part="control" data-krds-state="" part="control" id="control" name=${this.name} type="range" min=${this.min} max=${this.max} step=${this.step} .value=${live(String(value))} value=${value} ?disabled=${this.formControl.disabled} aria-label=${ifDefined(this.explicitName)} aria-valuetext=${ifDefined(this.valueText?.(value))} aria-describedby=${ifDefined(this.descriptionIds)} @input=${this.input} style="touch-action:pan-y;pointer-events:auto"><output data-krds-component="range-slider" data-krds-part="output" data-krds-state="" part="output" for="control">${this.valueText?.(value) ?? value}</output><span data-krds-component="range-slider" data-krds-part="minimum" data-krds-state="" part="minimum">${this.min}</span><span data-krds-component="range-slider" data-krds-part="maximum" data-krds-state="" part="maximum">${this.max}</span>${this.hint ? html `<p id=${this.helpId || 'hint'} >${this.hint}</p>` : ''}${this.error ? html `<p id=${this.errorId || 'error'} >${this.error}</p>` : ''}</div>`; }
}
