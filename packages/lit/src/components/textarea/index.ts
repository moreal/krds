import { type PropertyValues } from 'lit';
import { html, unsafeStatic } from 'lit/static-html.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { ValueState } from '../base.js';
import { FormElement } from '../catalog-support.js';
export class Textarea extends FormElement {
    static formAssociated = true;
    static override properties = { value: { type: String }, defaultValue: { attribute: 'default-value' }, rows: { type: Number }, readOnly: { type: Boolean, attribute: 'readonly' }, maxLength: { type: Number, attribute: 'maxlength' } };
    declare value: string | undefined;
    declare defaultValue: string | undefined;
    declare rows: number;
    declare readOnly: boolean;
    declare maxLength: number | undefined;
    private state = new ValueState<string>();
    private composing = false; private compositionDraft = '';
    private initialText: string | undefined;
    constructor() { super(); this.rows = 5; this.readOnly = false; }
    get committedValue() { return this.state.read(this.value, this.defaultValue, () => ''); }
    resetControl() { this.state.reset(); this.composing = false; this.requestUpdate(); }
    restoreControl(value: string | FormData | File | null) { if (typeof value === 'string') {
        this.state.set(value);
        this.requestUpdate();
    } }
    override updated(_changed: PropertyValues) { const input = this.renderRoot.querySelector('textarea')!; if (!this.composing)
        input.value = this.committedValue; this.sync(input, this.committedValue, this.committedValue); }
    private input = (event: Event) => { const input = event.target as HTMLTextAreaElement; if (this.composing) { this.compositionDraft = input.value; return; } if (this.formControl.disabled || this.readOnly)
        return; if (input.value !== this.committedValue) {
        const value = input.value;
        this.state.set(value);
        this.emit('value-change', { value });
    } this.requestUpdate(); queueMicrotask(() => { if (!this.composing)
        input.value = this.committedValue; }); };
    override render() {
        this.validateName();
        this.initialText ??= this.committedValue.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
        if (!Number.isInteger(this.rows) || this.rows < 1)
            throw new RangeError('Invalid textarea rows');
        const state = [this.formControl.disabled ? 'disabled' : '', this.readOnly ? 'readonly' : '', this.invalid ? 'invalid' : ''].filter(Boolean).join(' ');
        return html `<div data-krds-component="textarea" data-krds-part="root" data-krds-state=${state} part="root"><label data-krds-component="textarea" data-krds-part="label" data-krds-state="" part="label" for="control">${this.label}</label><textarea data-krds-component="textarea" data-krds-part="control" data-krds-state="" part="control" id="control" name=${this.name} rows=${this.rows} .value=${live(this.composing ? this.compositionDraft : this.committedValue)} ?disabled=${this.formControl.disabled} ?readonly=${this.readOnly} ?required=${this.required} maxlength=${ifDefined(this.maxLength)} aria-label=${ifDefined(this.explicitName)} aria-invalid=${ifDefined(this.invalid ? 'true' : undefined)} aria-describedby=${ifDefined(this.descriptionIds)} @input=${this.input} @compositionstart=${(event: Event) => { this.composing = true; this.compositionDraft = (event.currentTarget as HTMLTextAreaElement).value; }} @compositionend=${(event: Event) => { this.composing = false; this.input(event); }}>${unsafeStatic(this.initialText)}</textarea><span data-krds-component="textarea" data-krds-part="count" data-krds-state="" part="count">${this.committedValue.length}${this.maxLength === undefined ? '' : ` / ${this.maxLength}`}</span>${this.hint ? html `<p id=${this.helpId || 'hint'} data-krds-component="textarea" data-krds-part="help" data-krds-state="" part="help">${this.hint}</p>` : ''}${this.error ? html `<p id=${this.errorId || 'error'} data-krds-component="textarea" data-krds-part="error" data-krds-state="" part="error">${this.error}</p>` : ''}</div>`;
    }
}
