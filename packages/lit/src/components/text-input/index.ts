import { html, type PropertyValues } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { ValueState } from '../base.js';
import { FormElement } from '../catalog-support.js';
import type { TextInputContract } from '@unofficial-krds/contracts';
export class TextInput extends FormElement {
    static formAssociated = true;
    static override properties = { value: { type: String }, defaultValue: { attribute: 'default-value' }, type: { type: String }, autocomplete: { type: String }, inputMode: { type: String, attribute: 'inputmode' }, readOnly: { type: Boolean, attribute: 'readonly' }, minLength: { type: Number, attribute: 'minlength' }, maxLength: { type: Number, attribute: 'maxlength' }, pattern: { type: String }, status: { type: String }, size: { type: String }, iconAction: { attribute: false } };
    declare value: string | undefined;
    declare defaultValue: string | undefined;
    declare type: NonNullable<TextInputContract['type']>;
    declare autocomplete: string;
    declare inputMode: string;
    declare readOnly: boolean;
    declare minLength: number | undefined;
    declare maxLength: number | undefined;
    declare pattern: string | undefined;
    declare status: NonNullable<TextInputContract['status']>;
    declare size: NonNullable<TextInputContract['size']>;
    declare iconAction: TextInputContract['iconAction'];
    private state = new ValueState<string>();
    private composing = false; private compositionDraft = '';
    constructor() { super(); this.type = 'text'; this.autocomplete = ''; this.inputMode = ''; this.readOnly = false; this.status = 'default'; this.size = 'medium'; }
    get committedValue() { return this.state.read(this.value, this.defaultValue, () => ''); }
    resetControl() { this.state.reset(); this.composing = false; this.requestUpdate(); }
    restoreControl(value: string | FormData | File | null) { if (typeof value === 'string') {
        this.state.set(value);
        this.requestUpdate();
    } }
    override updated(_changed: PropertyValues) { const input = this.renderRoot.querySelector('input')!; if (!this.composing)
        input.value = this.committedValue; this.sync(input, this.committedValue, this.committedValue); }
    private input = (event: Event) => { const input = event.target as HTMLInputElement; if (this.composing) { this.compositionDraft = input.value; return; } if (this.formControl.disabled || this.readOnly)
        return; const value = input.value; if (value !== this.committedValue) {
        this.state.set(value);
        this.emit('value-change', { value });
    } this.requestUpdate(); queueMicrotask(() => { if (!this.composing)
        input.value = this.committedValue; }); };
    override render() {
        this.validateName();
        if (!['text', 'email', 'tel', 'url', 'password', 'search'].includes(this.type) || !['default', 'error', 'success'].includes(this.status) || !['small', 'medium', 'large'].includes(this.size))
            throw new TypeError('Invalid text input configuration');
        const state = [this.formControl.disabled ? 'disabled' : '', this.readOnly ? 'readonly' : '', this.invalid || this.status === 'error' ? 'invalid' : this.status === 'success' ? 'success' : ''].filter(Boolean).join(' ');
        return html `<div data-krds-component="text-input" data-krds-part="root" data-krds-state=${state} part="root" data-krds-size=${this.size} data-krds-status=${this.status}><label data-krds-component="text-input" data-krds-part="label" data-krds-state="" part="label" for="control">${this.label}</label><div><input data-krds-component="text-input" data-krds-part="control" data-krds-state=${state} part="control" id="control" name=${this.name} type=${this.type} .value=${live(this.composing ? this.compositionDraft : this.committedValue)} autocomplete=${this.autocomplete} inputmode=${this.inputMode} ?disabled=${this.formControl.disabled} ?readonly=${this.readOnly} ?required=${this.required} minlength=${ifDefined(this.minLength)} maxlength=${ifDefined(this.maxLength)} pattern=${ifDefined(this.pattern)} aria-label=${ifDefined(this.explicitName)} aria-invalid=${ifDefined(this.invalid || this.status === 'error' ? 'true' : undefined)} aria-describedby=${ifDefined(this.descriptionIds)} @input=${this.input} @compositionstart=${(event: Event) => { this.composing = true; this.compositionDraft = (event.currentTarget as HTMLInputElement).value; }} @compositionend=${(event: Event) => { this.composing = false; this.input(event); }}>${this.iconAction ? html `<button data-krds-component="text-input" data-krds-part="icon-action" data-krds-state=${state} part="icon-action" type="button" ?disabled=${this.formControl.disabled} @click=${() => { this.iconAction?.onAction(); this.emit('icon-action', {}); }}>${this.iconAction.label}</button>` : ''}</div>${this.status === 'success' ? html `<span>✓ 확인 완료</span>` : ''}${this.hint ? html `<p id=${this.helpId || 'hint'} data-krds-component="text-input" data-krds-part="help" data-krds-state="" part="help">${this.hint}</p>` : ''}${this.error ? html `<p id=${this.errorId || 'error'} data-krds-component="text-input" data-krds-part="error" data-krds-state="" part="error">${this.error}</p>` : ''}</div>`;
    }
}
